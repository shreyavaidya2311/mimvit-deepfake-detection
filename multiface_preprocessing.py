import cv2
import numpy as np
import torch
import tensorflow as tf
from retinaface import RetinaFace
import random

from deep_sort.deep_sort import nn_matching
from deep_sort.deep_sort.detection import Detection
from deep_sort.deep_sort.tracker import Tracker

NUM_FRAMES = 32


def retina(frame):
    results = RetinaFace.detect_faces(frame)
    return results


def create_box_encoder(
    model_filename, input_name="images", output_name="features", batch_size=32
):
    with tf.io.gfile.GFile(model_filename, "rb") as f:
        graph_def = tf.compat.v1.GraphDef()
        graph_def.ParseFromString(f.read())
    with tf.Graph().as_default() as graph:
        tf.import_graph_def(graph_def, name="")

    input_var = graph.get_tensor_by_name(f"{input_name}:0")
    output_var = graph.get_tensor_by_name(f"{output_name}:0")
    assert len(output_var.get_shape()) == 2
    assert len(input_var.get_shape()) == 4
    feature_dim = output_var.get_shape().as_list()[-1]
    image_shape = input_var.get_shape().as_list()[1:]

    def wrap_frozen_graph(graph_def, inputs, outputs):
        """Helper wrapper that imports tensorflow 1 graph into Tensorflow 2 object.
        reference: https://www.tensorflow.org/guide/migrate
        """

        def _imports_graph_def():
            tf.compat.v1.import_graph_def(graph_def, name="")

        wrapped_import = tf.compat.v1.wrap_function(_imports_graph_def, [])
        import_graph = wrapped_import.graph
        return wrapped_import.prune(
            tf.nest.map_structure(import_graph.as_graph_element, inputs),
            tf.nest.map_structure(import_graph.as_graph_element, outputs),
        )

    graph_function = wrap_frozen_graph(
        graph_def, inputs=f"{input_name}:0", outputs=f"{output_name}:0"
    )

    def _run_in_batches(f: callable, data: tf.Tensor, out: str, batch_size: int):
        data_len = len(out)
        num_batches = int(data_len / batch_size)

        s, e = 0, 0
        for i in range(num_batches):
            s, e = i * batch_size, (i + 1) * batch_size
            batch_data_dict = data[s:e]
            out[s:e] = f(batch_data_dict)
        if e < len(out):
            batch_data_dict = data[e:]
            out[e:] = f(batch_data_dict)

    def call(data_x, batch_size=32):
        if isinstance(data_x, np.ndarray):
            data_x = tf.convert_to_tensor(data_x)
        out = np.zeros((len(data_x), feature_dim), np.float32)
        _run_in_batches(graph_function, data_x, out, batch_size)
        return out

    def extract_image_patch(image, bbox, patch_shape):
        """Extract image patch from bounding box.

        Parameters
        ----------
        image : ndarray
            The full image.
        bbox : array_like
            The bounding box in format (x, y, width, height).
        patch_shape : Optional[array_like]
            This parameter can be used to enforce a desired patch shape
            (height, width). First, the `bbox` is adapted to the aspect ratio
            of the patch shape, then it is clipped at the image boundaries.
            If None, the shape is computed from :arg:`bbox`.

        Returns
        -------
        ndarray | NoneType
            An image patch showing the :arg:`bbox`, optionally reshaped to
            :arg:`patch_shape`.
            Returns None if the bounding box is empty or fully outside of the image
            boundaries.

        """
        bbox = np.array(bbox)
        if patch_shape is not None:

            target_aspect = float(patch_shape[1]) / patch_shape[0]
            new_width = target_aspect * bbox[3]
            bbox[0] -= (new_width - bbox[2]) / 2
            bbox[2] = new_width

        bbox[2:] += bbox[:2]
        bbox = bbox.astype(np.int)

        bbox[:2] = np.maximum(0, bbox[:2])
        bbox[2:] = np.minimum(np.asarray(image.shape[:2][::-1]) - 1, bbox[2:])
        if np.any(bbox[:2] >= bbox[2:]):
            return None
        sx, sy, ex, ey = bbox
        image = image[sy:ey, sx:ex]
        image = cv2.resize(image, tuple(patch_shape[::-1]))
        return image

    def encoder(image, boxes):
        image_patches = []
        for box in boxes:
            patch = extract_image_patch(image, box, image_shape[:2])
            if patch is None:
                print("WARNING: Failed to extract image patch: %s." % str(box))
                patch = np.random.uniform(0.0, 255.0, image_shape).astype(np.uint8)
            image_patches.append(patch)
        image_patches = np.asarray(image_patches)
        return call(image_patches, batch_size)

    return encoder


def extract_preprocessed_frames_multiface(video_path):
    frame_size = (224, 224)
    max_cosine_distance = 0.7
    nn_budget = None
    model_filename = "mars-small128.pb"
    encoder = create_box_encoder(model_filename, batch_size=1)
    metric = nn_matching.NearestNeighborDistanceMetric(
        "cosine", max_cosine_distance, nn_budget
    )

    tracker = Tracker(metric)
    vid = cv2.VideoCapture(video_path)
    outputVideos = dict()

    frames = int(vid.get(cv2.CAP_PROP_FRAME_COUNT))

    for i in range(1, frames + 1):

        success, frame = vid.read()

        if not success:
            break

        results = retina(frame)

        if type(results) is tuple:

            continue
        elif type(results) is dict:

            pass
        else:
            print(f"Unusual Type returned by retinaface: {type(results)}")

        bboxes = []
        scores = []

        for key, val in results.items():
            (startX, startY, endX, endY) = val["facial_area"]
            w = endX - startX
            h = endY - startY
            bboxes.append([startX, startY, w, h])
            scores.append(val["score"])

        features = encoder(frame, bboxes)

        detections = [
            Detection(bbox, score, feature, "a")
            for bbox, score, feature in zip(bboxes, scores, features)
        ]

        tracker.predict()
        tracker.update(detections)

        for track in tracker.tracks:

            if not track.is_confirmed() or track.time_since_update > 1:
                continue

            bbox = list(track.to_tlbr())

            startX = bbox[0]
            startY = bbox[1]
            endX = bbox[2]
            endY = bbox[3]
            bW = endX - startX
            bH = endY - startY
            centerX = startX + (bW / 2.0)
            centerY = startY + (bH / 2.0)

            left = centerX - bW / 2.0
            top = centerY - bH / 2.0
            right = centerX + bW / 2.0
            bottom = centerY + bH / 2.0

            try:

                if not track.track_id in outputVideos:
                    outputVideos[track.track_id] = []

                outputVideos[track.track_id].append((i, top, bottom, left, right))
            except Exception as e:
                print(e)

                print(
                    "error in face number : ",
                    track.track_id,
                    "video path: ",
                    video_path,
                )

    vid.release()

    all_frames = []
    for faceId in outputVideos:
        current_frames = []
        if len(outputVideos[faceId]) < 32:
            continue
        outputVideos[faceId] = random.sample(outputVideos[faceId], NUM_FRAMES)
        outputVideos[faceId] = sorted(outputVideos[faceId])

        j = 0
        vid = cv2.VideoCapture(video_path)
        for i in range(1, frames + 1):
            if j >= NUM_FRAMES:
                break
            frameNo, top, bottom, left, right = outputVideos[faceId][j]
            if i != frameNo:
                vid.grab()
                continue
            j += 1

            success, frame = vid.read()
            if not success:
                break

            current_frames.append(
                cv2.resize(
                    frame[int(top) : int(bottom), int(left) : int(right), :],
                    frame_size,
                )
            )
        vid.release()
        all_frames.append(current_frames)
    all_frames = np.array(all_frames)
    all_frames = np.transpose(all_frames, (0, 1, 4, 2, 3))
    all_frames = torch.from_numpy(all_frames).float()
    return all_frames


if __name__ == "__main__":
    extract_preprocessed_frames_multiface("test.mp4")

import torch
from torch.utils.data import Dataset, DataLoader
import torch.nn as nn
from timm.models import convnextv2_base
from timm.layers import create_classifier
import torch.nn.functional as F


class OurModel(nn.Module):
    def __init__(
        self, image_size, num_features, drop_rate=0.4, num_classes=2, training=False
    ) -> None:
        super(OurModel, self).__init__()
        self.image_size = image_size
        self.num_features = num_features
        self.drop_rate = drop_rate
        self.num_classes = num_classes
        self.training = training

        self.cnn = convnextv2_base(pretrained=True, num_classes=1, drop_rate=0.4)
        self.transformer = mvitv2_base(pretrained=True)
        self.global_pool, self.classifier = create_classifier(
            self.num_features, self.num_classes, pool_type="avg"
        )
        self.sigmoid = nn.Sigmoid()

    def forward_features(self, x):
        cnn_features = self.cnn(x)
        transformer_features = self.transformer(x)
        x = torch.cat((cnn_features, transformer_features), dim=1)
        x = cnn_features
        return x

    def forward_head(self, x):
        if self.drop_rate > 0.0:
            x = F.dropout(x, p=self.drop_rate, training=self.training)
        return self.sigmoid(self.classifier(x))

    def forward(self, x):
        batch_size, seq_length, c, h, w = x.shape
        x = x.view(batch_size * seq_length, c, h, w)
        x = self.forward_features(x)
        x = self.sigmoid(x)
        # x = self.forward_head(x)
        x = x.view(batch_size, seq_length, 1)
        return x

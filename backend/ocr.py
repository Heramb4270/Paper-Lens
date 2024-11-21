# %%
# import torch
# print(torch.__version__)
# print(torch.cuda.is_available())
# print(torch.cuda.device_count())
# print(torch.cuda.current_device())
# print(torch.cuda.get_device_name(0))
# print(torch.cuda.memory_allocated())

# %%
# import nessisary libraries

# %%
# there a note book page with hand wirtten text on it, I want to do line segmentation on it as each time the formate of
# page will be same i want to divide the page into 36 parts/lines equaly 

image_path = './pdf_images/page_1.png'
# display image using matplotlib
import matplotlib.pyplot as plt
import cv2
import numpy as np


# %%

image = cv2.imread(image_path)
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
plt.imshow(image)


# %%
# divide the image into 35 equal parts
# first we need to find the height of the image
height, width, _ = image.shape
print(height, width)

# divide the height by 35
line_height = height // 35
print(line_height)

# now we will divide the image into 36 equal parts
lines = []
for i in range(35):
    start = i * line_height
    end = (i + 1) * line_height
    line = image[start:end, :]
    lines.append(line)
    
# display all the lines
fig, axes = plt.subplots(35, 1, figsize=(10, 40))
for i, line in enumerate(lines):
    axes[i].imshow(line)
    axes[i].axis('off')
plt.show()


# %%
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image


# image = Image.open(, stream=True).raw).convert("RGB")

processor = TrOCRProcessor.from_pretrained('microsoft/trocr-large-handwritten')
model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-large-handwritten')
    
for image in lines:
    pixel_values = processor(images=image, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    print(generated_text)



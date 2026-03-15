#!/usr/bin/env python3
"""
Simple background removal script for calisthenics frames.
Removes light backgrounds and keeps the character.
"""

import os
from PIL import Image
import numpy as np

def remove_background(input_path, output_path, threshold=200):
    """
    Remove light background from image.
    threshold: pixels with R,G,B all above this value become transparent
    """
    # Open image
    img = Image.open(input_path)
    
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Convert to numpy array for processing
    data = np.array(img)
    
    # Create mask: pixels where R, G, B are all above threshold
    # These are likely background pixels
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Create mask for light background (white/light gray)
    background_mask = (r > threshold) & (g > threshold) & (b > threshold)
    
    # Also check for very light pixels (close to white)
    # This helps with gradient backgrounds
    lightness = (r.astype(float) + g.astype(float) + b.astype(float)) / 3.0
    light_mask = lightness > threshold
    
    # Combine masks
    combined_mask = background_mask | light_mask
    
    # Set alpha to 0 for background pixels
    data[:,:,3] = np.where(combined_mask, 0, a)
    
    # Create new image from processed data
    result = Image.fromarray(data, 'RGBA')
    
    # Save result
    result.save(output_path, 'PNG')
    print(f"Processed: {input_path} -> {output_path}")
    
    return result

def main():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    frames_dir = os.path.join(script_dir, "frames")
    output_dir = os.path.join(script_dir, "frames_processed")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process all frame images
    for i in range(1, 6):
        input_file = os.path.join(frames_dir, f"frame{i}.png")
        output_file = os.path.join(output_dir, f"frame{i}.png")
        
        if os.path.exists(input_file):
            print(f"Processing {input_file}...")
            remove_background(input_file, output_file, threshold=180)
        else:
            print(f"Warning: {input_file} not found")
    
    print("\nBackground removal complete!")
    print(f"Processed images saved to: {output_dir}")

if __name__ == "__main__":
    main()
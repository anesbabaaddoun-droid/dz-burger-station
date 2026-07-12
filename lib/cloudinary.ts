export async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'menu_items_upload');

    const response = await fetch(
        'https://api.cloudinary.com/v1_1/vf1m3hao/image/upload',
        {
            method: 'POST',
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
}
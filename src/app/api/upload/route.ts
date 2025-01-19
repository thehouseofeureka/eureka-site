import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

interface CloudinaryUploadOptions {
  folder: string;
  resource_type: 'image' | 'raw';
  chunk_size: number;
  public_id?: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'profile' or 'resume'
    const fileExtension = formData.get('fileExtension') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileStr = `data:${file.type};base64,${buffer.toString('base64')}`;

    try {
      const uploadOptions: CloudinaryUploadOptions = {
        folder: fileType === 'profile' ? 'profile_pictures' : 'resumes',
        resource_type: fileType === 'profile' ? 'image' : 'raw',
        chunk_size: 6000000,
      };

      // For resume files, add the extension to the public_id
      if (fileType === 'resume' && fileExtension) {
        // Generate a unique filename with the extension
        const timestamp = new Date().getTime();
        uploadOptions.public_id = `resume_${timestamp}.${fileExtension}`;
      }

      const result = await cloudinary.uploader.upload(fileStr, uploadOptions);

      return NextResponse.json(result);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { error: 'Error uploading to Cloudinary' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error processing upload' },
      { status: 500 }
    );
  }
}
import { put } from '@vercel/blob';
import fetch from 'node-fetch';

export const uploadToVercelBlob = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const { url } = await put(fileName, fileBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return url;
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error('Failed to upload file: ' + (error as Error).message);
  }
};

export const deleteFromVercelBlob = async (fileUrl: string): Promise<void> => {
  if (!fileUrl) {
    return;
  }
  try {
    const fileName = fileUrl.split('/').pop()!;
    const response = await fetch(`https://api.vercel.com/v2/blob/files/${fileName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete from Vercel Blob');
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
  }
};
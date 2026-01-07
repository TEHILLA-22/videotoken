import { Button } from '@/components/ui/button';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IoMdImages } from "react-icons/io";
import { LuFileVideo } from "react-icons/lu";
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';
import { TbDragDrop } from "react-icons/tb";
import Player from '@/components/customs/video-player/player';
import Video from 'next-video';


interface UploadProps {
    onUpload: (file: File) => void;
}

export function UploadVideo({ onUpload }: UploadProps) {
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.size > 22 * 1024 * 1024) {
            toast.info("Video must be less than 22MB");
            return;
        }

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            if (video.duration > 60) {
                toast.info('Video must be less than 16 seconds.');
            } else {
                onUpload(file);
                const previewURL = URL.createObjectURL(file);
                setVideoPreview(previewURL);
            }
        };
        video.src = URL.createObjectURL(file);
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'video/*': [] }
    });

    return (
        <div className="flex flex-col w-full items-center">
            {videoPreview ? (
                <div className='flex flex-col items-center gap-4'>
                    <span>
                        <LuFileVideo size={50} color='white' />
                    </span>
                    <div className='flex flex-row items-center gap-4 py-4'>
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button size={"sm"} className="bg-amber-500 text-white font-light cursor-pointer">
                                    View Uploaded Video
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogTitle />
                <Video
                    as={Player}
                    height={500}
                    src={videoPreview}     
                    //poster="https://images.pexels.com/photos/31023570/pexels-photo-31023570/free-photo-of-romantic-dinner-with-st-peter-s-dome-in-view.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                />
                            </DialogContent>
                        </Dialog>
                        <Button variant={'outline'} type='button' onClick={() => { }} className='bg-transparent rounded text-sm px-3 font-medium urbanist text-amber-500'>Clear Video</Button>
                    </div>
                </div>
            ) :
                <div {...getRootProps()} className="border border-dashed border-white/50 p-4 rounded cursor-pointer text-center urbanist w-full">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <div>Drop the video here ...</div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <p className="text-white/50">Drag and drop a file here or</p>
                            <Button className="px-4 text-white text-center border my-2 max-w-3xs mx-auto border-white rounded">
                                Choose A File
                            </Button>
                            <p className="text-white/50 text-sm md:text-base">Supported formats: mov, mp4, avi (max. 22MB)</p>
                            <p className="text-white/50 text-sm md:text-base">Max length: 15sec</p>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}

export function UploadPhoto({ onUpload }: UploadProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.info("Photo must be less than 5MB");
            return;
        }

        onUpload(file);
        const previewURL = URL.createObjectURL(file);
        setPhotoPreview(previewURL);
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    return (
        <div className="flex flex-col w-full items-center">
            {photoPreview ? (
                <div className='flex flex-col items-center gap-4'>
                    <span>
                        <IoMdImages size={50} color='white' />
                    </span>
                    <div className='flex flex-row items-center gap-4 py-4'>
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button size={"sm"} className="bg-amber-500 text-white font-light cursor-pointer">
                                    View Uploaded Photo
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md h-full">
                                <DialogTitle />
                                <Image src={photoPreview} fill fetchPriority='high' alt="Uploaded Preview" className="w-full rounded object-contain" />
                            </DialogContent>
                        </Dialog>
                        <Button variant={'outline'} type='button' onClick={() => { }} className='bg-transparent rounded text-sm px-3 font-medium urbanist text-amber-500'>Clear Photo</Button>
                    </div>
                </div>
            ) :
                <div {...getRootProps()} className="border border-dashed border-white/50 p-4 rounded cursor-pointer text-center urbanist w-full">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <div className='flex flex-col items-center'>
                            <TbDragDrop size={40} />
                            <p className='text-white/50 text-2xl'>Drop the photo here ...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <p className="text-white/50 text-sm md:text-base">Drag and drop a file here or</p>
                            <Button className="px-4 text-white text-center border my-2 max-w-3xs mx-auto border-white rounded">
                                Choose A File
                            </Button>
                            <p className="text-white/50 text-sm md:text-base">Supported formats: JPEG, PNG, JPG (max. 5MB)</p>
                            <p className="text-white/50 text-sm md:text-base">Recommended size: 300x300px</p>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}

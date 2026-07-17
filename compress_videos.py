import os
import subprocess

videos_dir = r"o:\Bootstrapped Cafe\client\src\assets\videos"
for filename in os.listdir(videos_dir):
    if filename.endswith(".mp4") or filename.endswith(".mov"):
        filepath = os.path.join(videos_dir, filename)
        new_filename = os.path.splitext(filename)[0] + ".mp4"
        temp_path = os.path.join(videos_dir, "temp_" + new_filename)
        final_path = os.path.join(videos_dir, new_filename)
        print(f"Compressing {filename} to {new_filename}...")
        
        # -2:720 scales height to 720 and sets width automatically keeping aspect ratio while being divisible by 2
        cmd = [
            "ffmpeg", "-i", filepath, 
            "-vf", "scale=-2:720", 
            "-vcodec", "libx264", "-crf", "30", "-preset", "veryfast", 
            "-acodec", "aac", "-b:a", "96k", "-movflags", "+faststart", "-y", temp_path
        ]
        res = subprocess.run(cmd)
        if res.returncode == 0:
            if filename != new_filename:
                os.remove(filepath)
            os.replace(temp_path, final_path)
            print(f"Successfully compressed {filename}")
        else:
            print(f"Failed to compress {filename}")

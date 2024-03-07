const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

function converterVideoWEBM(input, output) {
    console.log("Iniciando conversão do video MP4 para WEBM")
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(input)
            .videoCodec('libvpx-vp9')
            .audioCodec('libopus')
            .addOption('-crf', '30')
            .addOption('-b:v', '0')
            .addOption('-b:a', '128k')
            .addOption('-threads', '4')
            .on('end', () => {
                console.log('Conversão concluída');
                resolve();
            })
            .on('error', (err) => {
                console.error('Erro:', err);
                reject(err);
            })
            .save(output);
    });
}

function converterVideoHSL(inputVideo, outputDirectory) {
    console.log("Iniciando conversão do video WEBM para HSL")
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }
    
    const ffmpegCommand = ffmpeg(inputVideo)
        .outputOptions([
            '-c:v h264',
            '-hls_time 10',
            '-hls_list_size 0',
            '-hls_segment_filename ' + outputDirectory + 'segment%d.ts',
        ])
        .output(outputDirectory + 'playlist.m3u8');
    
    ffmpegCommand.on('end', () => {
        console.log('Conversão concluída com sucesso.');
    }).on('error', (err) => {
        console.error('Erro durante a conversão:', err);
    }).run();
}

async function main(){
    //await converterVideoWEBM('src/videos/BigBuckBunny.mp4', 'src/videos/output/BigBuckBunny.webm')
    await converterVideoHSL('src/videos/BigBuckBunny.webm', 'src/videos/output/')
}

main()

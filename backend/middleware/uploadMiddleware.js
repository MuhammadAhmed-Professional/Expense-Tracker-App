import multer from 'multer';

//configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = process.env.VERCEL === "1" ? '/tmp' : 'uploads/';
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

//File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('only .jpeg .jpg .png formats are allowed'), false);
    }
};

const upload = multer({storage, fileFilter});

export default upload
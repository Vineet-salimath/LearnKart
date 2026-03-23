import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Award, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Certificate = ({ isOpen, onClose, course, userName, completionDate }) => {
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${course.title.replace(/\s+/g, '-')}-Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate certificate. Please try again.');
    }
  };

  if (!isOpen) return null;

  const formattedDate = completionDate
    ? new Date(completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Certificate Card */}
        <div
          ref={certificateRef}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            aspectRatio: '16/11',
            padding: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {/* Decorative Border */}
          <div
            className="h-full border-8 border-white rounded-xl flex flex-col items-center justify-center"
            style={{ padding: '40px' }}
          >
            {/* Award Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mb-6"
            >
              <Award size={80} className="text-yellow-300" />
            </motion.div>

            {/* Certificate Title */}
            <h1 className="text-5xl font-bold text-white mb-4 font-serif">
              Certificate of Completion
            </h1>

            {/* Divider */}
            <div className="w-32 h-1 bg-yellow-300 mb-8"></div>

            {/* Text Content */}
            <p className="text-xl text-white mb-3">This is to certify that</p>
            <h2 className="text-4xl font-bold text-yellow-300 mb-6 font-serif">
              {userName || 'Student Name'}
            </h2>
            <p className="text-xl text-white mb-3">has successfully completed</p>
            <h3 className="text-3xl font-bold text-white mb-8 text-center max-w-2xl">
              {course.title}
            </h3>

            {/* Course Details */}
            <div className="flex items-center gap-8 text-white text-sm mb-8">
              <div className="text-center">
                <p className="font-semibold">Instructor</p>
                <p>{course.author}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Level</p>
                <p>{course.lvl}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Completion Date</p>
                <p>{formattedDate}</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex justify-around w-full mt-auto">
              <div className="text-center">
                <div className="border-t-2 border-white w-48 mb-2"></div>
                <p className="text-white text-sm font-semibold">Platform Director</p>
                <p className="text-white text-xs">LearnKart LMS</p>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-white w-48 mb-2"></div>
                <p className="text-white text-sm font-semibold">{course.author}</p>
                <p className="text-white text-xs">Course Instructor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleDownload}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all flex items-center gap-3"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Download size={20} />
            Download Certificate (PDF)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Certificate;

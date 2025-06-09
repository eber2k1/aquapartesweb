// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaWater } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren"
    }
  }
};

const dotVariants = {
  hidden: { y: 0 },
  visible: {
    y: [0, -15, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

const PageLoader = ({ message = 'Cargando...' }) => {
  return (
    <motion.div
      className="w-full min-h-[90vh] flex flex-col items-center justify-center py-16"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="relative">
        <motion.div
          className="text-5xl text-sky-600 mb-4"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <FaWater />
        </motion.div>
        
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-2 h-2 bg-sky-600 rounded-full"
              variants={dotVariants}
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {message && (
        <motion.p 
          className="mt-4 text-sm text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default PageLoader;

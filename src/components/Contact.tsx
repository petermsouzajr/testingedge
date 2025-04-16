'use client';

import React from 'react';
// import SectionHeading from './section-heading'; // Removed
import { motion } from 'framer-motion';
// import { useSectionInView } from '@/lib/hooks'; // Removed hook
import { sendEmail } from '@/actions/sendEmail'; // Added back import
// import SubmitBtn from './submit-btn'; // Removed
import toast from 'react-hot-toast';

export default function Contact() {
  // const { ref } = useSectionInView('Contact'); // Removed hook call

  // Ref for the form to reset it
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <motion.section
      id="contact-form" // Changed ID
      // ref={ref} // Removed ref
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      {/* Replaced SectionHeading with h2 and restored text */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Have More Questions?
      </h2>
      {/* Replaced direct email paragraph with inquiry guidance */}
      <p className="text-gray-700 -mt-6 dark:text-white/80">
        We'd love to hear from you! Drop your questions or comments below, and
        we'll get back to you soon.
      </p>

      <form
        ref={formRef} // Add ref for resetting
        className="mt-10 flex flex-col dark:text-black"
        action={async (formData) => {
          // Use the server action
          const { data, error } = await sendEmail(formData);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success('Email sent successfully!');
          formRef.current?.reset(); // Reset form on success
        }}
        // Removed previous onSubmit handler
      >
        <input
          className="h-14 px-4 rounded-lg border bg-gray-100 border-gray-300 dark:border-gray-600 dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none dark:text-gray-800 placeholder:text-gray-500"
          name="senderEmail"
          type="email"
          required
          maxLength={100}
          placeholder="Your email address"
        />
        <textarea
          className="h-52 my-3 rounded-lg border bg-gray-100 border-gray-300 dark:border-gray-600 p-4 dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none dark:text-gray-800 placeholder:text-gray-500"
          name="message"
          placeholder="Your message"
          required
          maxLength={2000}
        />
        {/* Replaced SubmitBtn with standard button */}
        <button
          type="submit"
          className="group flex items-center text-black justify-center gap-2 h-[3rem] w-[8rem] bg-gray-900  rounded-full outline-none transition-all focus:scale-110 hover:scale-110 hover:bg-blue-500 hover:text-white active:scale-105 dark:bg-white dark:bg-opacity-10 disabled:scale-100 disabled:bg-opacity-65 self-center mt-4"
        >
          Submit
        </button>
      </form>
    </motion.section>
  );
}

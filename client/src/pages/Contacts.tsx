import type React from "react";
import { useState } from "react";
import { Loader } from "lucide-react";
import { usePostInfo } from "../api/api";
import Section from "../components/Section";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const { mutate, error, isError, isPending, isSuccess } = usePostInfo('/sendEmail');

  const onchange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ email: formData.email, message: formData.message });
    setFormData({ email: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 py-12 px-4">
      <Section size="sm">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 dark:text-green-300">Contact Us</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">Have a question, want to partner, or wish to volunteer? Send us a message and we’ll get back to you.</p>
        </header>

        {isError && (
          <div className="rounded-lg p-4 mb-4 bg-red-50 border border-red-200 text-red-700">
            <h3 className="font-semibold">Oops! Something went wrong.</h3>
            <p>{(error as Error)?.message || 'Please try again later.'}</p>
          </div>
        )}

        {isSuccess && (
          <div className="rounded-lg p-4 mb-4 bg-green-50 border border-green-200 text-green-700">
            <h3 className="font-semibold">Success!</h3>
            <p>Your message has been sent successfully.</p>
          </div>
        )}

        <form className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
            <input
              placeholder="your@email.com"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onchange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Message</label>
            <textarea
              placeholder="Write your message..."
              id="message"
              name="message"
              value={formData.message}
              onChange={onchange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[140px]"
              rows={6}
            />
          </div>

          <div className="flex justify-end items-center gap-4">
            <button
              type="reset"
              onClick={() => setFormData({ email: "", message: "" })}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-5 py-2 rounded-full bg-green-600 text-white font-semibold ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'}`}
            >
              {isPending ? <Loader className="animate-spin" /> : 'Send Message'}
            </button>
          </div>
        </form>
      </Section>
    </main>
  );
};

export default Contact;

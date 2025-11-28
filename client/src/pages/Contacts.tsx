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
    <main className="min-h-screen bg-surface py-12 px-4">
      <Section size="sm">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-accent">Contact Us</h1>
          <p className="mt-2 text-secondary-var">Have a question, want to partner, or wish to volunteer? Send us a message and we’ll get back to you.</p>
        </header>

        {isError && (
          <div className="rounded-lg p-4 mb-4 bg-error-light border border-error text-error">
            <h3 className="font-semibold">Oops! Something went wrong.</h3>
            <p>{(error as Error)?.message || 'Please try again later.'}</p>
          </div>
        )}

        {isSuccess && (
          <div className="rounded-lg p-4 mb-4 bg-success-light border border-success text-success">
            <h3 className="font-semibold">Success!</h3>
            <p>Your message has been sent successfully.</p>
          </div>
        )}

        <form className="bg-surface-2 dark:bg-surface-3 shadow-md rounded-xl p-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-secondary-var mb-2">Email</label>
            <input
              placeholder="your@email.com"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onchange}
              required
              className="input-base"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-secondary-var mb-2">Message</label>
            <textarea
              placeholder="Write your message..."
              id="message"
              name="message"
              value={formData.message}
              onChange={onchange}
              required
              className="input-base min-h-[140px]"
              rows={6}
            />
          </div>

          <div className="flex justify-end items-center gap-4">
            <button
              type="reset"
              onClick={() => setFormData({ email: "", message: "" })}
              className="px-4 py-2 rounded-full border border-surface text-secondary-var hover:bg-surface-3"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-5 py-2 rounded-full btn-primary font-semibold ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
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

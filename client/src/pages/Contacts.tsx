import type React from "react";
import { useState } from "react";
import { Loader } from "lucide-react";
import { usePostInfo } from "../api/api";

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
    console.log("Form submitted:", formData);



		mutate({ email: formData.email, message: formData.message });
		setFormData({ email: "", message: "" });
	};

  return (
    <div className="site-container">
      <div className="max-w-2xl w-full mx-auto py-8">
        {isError && (
          <div className="rounded-lg p-4 mb-4 bg-red-100 border border-red-400 text-red-700">
            <h3 className="font-semibold">Oops! Something went wrong.</h3>
            <p>{(error as Error)?.message || 'Please try again later.'}</p>
          </div>
        )}

        {isSuccess && (
          <div className="rounded-lg p-4 mb-4 bg-green-100 border border-green-400 text-green-700">
            <h3 className="font-semibold">Success!</h3>
            <p>Your message has been sent successfully.</p>
          </div>
        )}

        <form className="card section fade-in shadow-md rounded-lg p-6 bg-white dark:bg-gray-800" onSubmit={handleSubmit}>
          <h1 className="text-gradient mb-6 text-2xl font-bold">Contact Us</h1>

          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              placeholder="Input your email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onchange}
              required
              className="input-base"
            />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="message" className="font-medium">Message</label>
            <textarea
              placeholder="Talk to us"
              id="message"
              name="message"
              value={formData.message}
              onChange={onchange}
              required
              className="input-base min-h-[120px]"
              rows={5}
            />
          </div>

          <div className="flex justify-end items-center gap-4">
            <button
              type="reset"
              onClick={() => setFormData({ email: "", message: "" })}
              className="btn btn-danger"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`btn btn-primary ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPending ? <Loader className="animate-spin" /> : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;

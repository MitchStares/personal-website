import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submitIdea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, idea }),
      });

      if (response.ok) {
        toast.success('Thank you for your idea!');
        setName('');
        setEmail('');
        setIdea('');
      } else {
        throw new Error('Failed to submit idea');
      }
    } catch (error) {
      toast.error('Failed to submit idea. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }; 

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="idea" className="block text-sm font-medium text-gray-700">Your Idea</label>
        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-800 text-white px-4 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Idea'}
      </button>
    </form>
  );
};

export default ContactForm;

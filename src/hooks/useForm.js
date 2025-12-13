import { useState } from "react";

export const useForm = (initialValues, validateFn, onSubmit) => {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateFn(form);
    if (validationError) return setError(validationError);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return {
    form,
    error,
    handleChange,
    handleSubmit,
    setForm,
    setError,
  };
};

import React from "react";

interface ErrorMessageProps {
  title: string;
  message: string | React.ReactNode;
}

export function ErrorMessage({ title, message }: ErrorMessageProps) {
  return (
    <div className="p-4 border border-red-500 rounded-md">
      <h3 className="text-red-500 font-bold">{title}</h3>
      {typeof message === "string" ? (
        <p className="text-sm text-red-400">{message}</p>
      ) : (
        <div className="text-sm text-red-400">{message}</div>
      )}
    </div>
  );
}

interface CompositionErrorProps {
  errors: string[];
}

export function CompositionErrorMessage({ errors }: CompositionErrorProps) {
  return (
    <ErrorMessage
      title="Composition Error"
      message={
        <ul className="list-disc list-inside">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      }
    />
  );
}

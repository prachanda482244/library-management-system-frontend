import { Field } from "formik";
import React from "react";

const FormikTextarea = ({
  name,
  label,
  required,
  rows = 4,
  cols = 20,
  ...props
}) => {
  return (
    <div>
      <Field name={name}>
        {({ field, form, meta }) => {
          return (
            <div className="flex relative flex-col">
              <label
                className="capitalize tracking-wide font-medium flex gap-2 text-gray-500"
                htmlFor={name}
              >
                {label}
                <span className="text-red-900 text-xl">
                  {required ? "*" : ""}
                </span>
              </label>
              <textarea
                className="border-[1px] rounded-sm px-4 py-1 resize-none"
                {...field}
                {...props}
                id={name}
                rows={rows}
                cols={cols}
                value={meta.value}
                onChange={field.onChange}
                autoComplete="off"
              />
              <div className="h-2">
                {meta.touched && meta.error && (
                  <div className="text-red-500 text-sm italic">
                    {meta.error}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Field>
    </div>
  );
};

export default FormikTextarea;

import React, { useState } from "react";
import { Form, Formik } from "formik";
import FormikInput from "../../formik/FormikInput";
import FormikFile from "../../formik/FormikFile";
import { createBook } from "../../config/AxiosInstance";
import toast from "react-hot-toast";
import { bookValidationSchema } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import FormikTextarea from "../../formik/FormikTextArea";

const CreateBook = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const initialValues = {
    title: "",
    author: "",
    genre: "",
    price:0,
    publicationYear: 0,
    isbn: 0,
    description: "",
    avatar: null,
  };

  const formSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("author", values.author);
    formData.append("genre", values.genre);
    formData.append("publicationYear", parseInt(values.publicationYear));
    formData.append("isbn", parseInt(values.isbn));
    formData.append("description", values.description);
    formData.append("avatar", values.avatar);
formData.append("price",values.price)
    const { data } = await createBook(formData);

    console.log(data);
    if (data.statusCode === 200) {
      navigate("/dashboard/books");
      resetForm();
      setImagePreview(null);
      toast.success(data?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Formik
        initialValues={initialValues}
        validationSchema={bookValidationSchema}
        onSubmit={formSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off" className="space-y-6">
            <h1 className="text-center font-semibold text-3xl text-gray-700">
              Create New Book
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <FormikInput
                  type="text"
                  label="Book Title"
                  required={true}
                  name="title"
                />
                <FormikInput
                  type="text"
                  label="Author"
                  required={true}
                  name="author"
                />
                <FormikInput
                  type="text"
                  label="Genre"
                  required={true}
                  name="genre"
                />
                <FormikInput
                  type="number"
                  label="Price"
                  required={true}
                  name="price"
                />
                <FormikInput
                  type="number"
                  label="Publication Year"
                  required={true}
                  name="publicationYear"
                />
                <FormikTextarea
                  name="description"
                  label="Description"
                  required={true}
                />
                <FormikInput
                  type="number"
                  label="ISBN"
                  required={true}
                  name="isbn"
                />
              </div>
              <div className="flex flex-col items-center space-y-4">
                <FormikFile
                  name="avatar"
                  label="Upload Book Image"
                  setImagePreview={setImagePreview}
                />
                {imagePreview && (
                  <div className="w-full">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Book Preview"
                      className="w-full h-auto object-cover rounded-md shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
              >
                {isSubmitting ? "Creating Book..." : "Create Book"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateBook;

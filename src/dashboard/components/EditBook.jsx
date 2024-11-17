import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import FormikInput from "../../formik/FormikInput";
import { editBook, getSingleBook } from "../../config/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { bookValidationSchema } from "../../constants/constants";
import FormikTextarea from "../../formik/FormikTextArea";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({});

  const fetchSingleBook = async () => {
    try {
      const { data } = await getSingleBook(id);
      if (data.statusCode === 200) {
        setBook(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSingleBook();
  }, []);

  const bookInitialValues = {
    title: book.title || "",
    author: book.author || "",
    genre: book.genre || "",
    price:book?.price || 0,
    publicationYear: book.publicationYear || 0,
    isbn: book.isbn || 0,
    description: book?.description || "",
    // availability: book.availability || "true",
  };

  const formSubmit = async (values) => {
    try {
      console.log(values,"VALUES")
      const { data } = await editBook(id, values);
      console.log(data);
      if (data.statusCode === 200) {
        toast.success(data.message);
        navigate("/dashboard/books");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
        <Formik
          initialValues={bookInitialValues}
          validationSchema={bookValidationSchema}
          onSubmit={formSubmit}
          enableReinitialize={true}
        >
          {() => (
            <Form autoComplete="off">
              <h1 className="text-center font-semibold text-3xl text-gray-700 mb-8">
                Edit Book
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Input Fields */}
                <div className="space-y-6">
                  <FormikInput
                    type="text"
                    label="Book Title"
                    required={true}
                    name="title"
                    className="rounded-lg border-gray-300 shadow-sm"
                  />
                  <FormikInput
                    type="text"
                    label="Author"
                    required={true}
                    name="author"
                    className="rounded-lg border-gray-300 shadow-sm"
                  />
                  <FormikInput
                    type="text"
                    label="Genre"
                    required={true}
                    name="genre"
                    className="rounded-lg border-gray-300 shadow-sm"
                  />

                  <FormikInput
                    type="number"
                    label="Price"
                    required={true}
                    name="price"
                    className="rounded-lg border-gray-300 shadow-sm"
                  />

                  <FormikInput
                    type="number"
                    label="Publication Year"
                    required={true}
                    name="publicationYear"
                    className="rounded-lg border-gray-300 shadow-sm"
                  />
                  <FormikTextarea
                    label="Description"
                    name="description"
                    required={true}
                  />
                  <FormikInput
                    type="number"
                    label="ISBN"
                    required={true}
                    name="isbn"
                    className="rounded-lg border-gray-300 shadow-sm"
                  />

                  {/* Select for Availability */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="availability"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Availability
                    </label>
                    <select
                      name="availability"
                      className="rounded-lg border-gray-300 shadow-sm mt-1"
                      required
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  </div>
                </div>

                {/* Right: Image Preview */}
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                    <img
                      className="object-cover w-full h-full"
                      src={book?.coverImage || "/default-book-cover.jpg"}
                      alt="Book Cover"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    {book?.coverImage
                      ? "Current Book Cover"
                      : "No image uploaded"}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-10 flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg shadow-md text-lg font-semibold transition duration-200 ease-in-out"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditBook;

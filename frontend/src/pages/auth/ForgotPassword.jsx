/**
 * Forgot Password Page
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, Input, Button, Alert } from '../../components/common';
import { Mail, ArrowLeft } from 'lucide-react';
import { authService } from '../../services';

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError('');
        setSuccess('');
        
        await authService.forgotPassword(values.email);
        setSuccess('Recovery email sent! Check your inbox.');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send email. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title className="text-center">Forgot Password?</Card.Title>
          <p className="text-center text-gray-600 mt-2">
            Enter your email to receive recovery instructions
          </p>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert type="error" message={error} className="mb-4" />
          )}
          
          {success && (
            <Alert type="success" message={success} className="mb-4" />
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              touched={formik.touched.email}
              leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={formik.isSubmitting}
            >
              Send Email
            </Button>
          </form>
        </Card.Body>

        <Card.Footer>
          <Link
            to="/login"
            className="flex items-center justify-center text-sm font-medium text-rose-600 hover:text-rose-500"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ForgotPassword;

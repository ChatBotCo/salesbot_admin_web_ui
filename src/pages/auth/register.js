import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Alert, Box, Button, Link, Snackbar, Stack, TextField, Typography} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const {
    signUp,
    showAuthResults, authResults, authResultsSeverity,handleDismissAuthResults,
  } = useAuth();

  const [isEmailError, setIsEmailError] = useState(false)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      const isAllowed = isEmailAllowed(values.email)
      if(isAllowed) {
        try {
          if(await signUp(values.email, values.password)) window.location.replace("/")
        } catch (err) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      } else {
        setIsEmailError(true)
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Anonymous email addresses are not allowed.  Please use an email from your organization." });
        helpers.setSubmitting(false);
      }
    }
  });

  function isEmailAllowed(email) {
    const blacklistedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    return !blacklistedDomains.includes(domain);
  }


  return (
    <>
      <Head>
        <title>
          Register | Devias Kit
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Register
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={(!!(formik.touched.email && formik.errors.email)) || isEmailError}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={e=>{
                    setIsEmailError(false)
                    formik.handleChange(e)
                  }}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
      <Snackbar open={showAuthResults} autoHideDuration={6000} onClose={handleDismissAuthResults}>
        <Alert onClose={handleDismissAuthResults} severity={authResultsSeverity} sx={{ width: '100%' }}>
          {authResults}
        </Alert>
      </Snackbar>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;

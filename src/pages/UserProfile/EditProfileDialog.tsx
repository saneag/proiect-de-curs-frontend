import React from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';

import { useAppDispatch, useAppSelector } from 'redux/store';
import {
  addUserAvatar,
  deleteUserAvatar,
  updateUser,
} from 'redux/slices/userSlice';
import { Components } from 'components';

import { FormikFields, FormikTextArea } from './FormikFields';
import { UserEditSchema } from './FormikSchemas';

interface IProps {
  onClose: () => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

const DirtyReporter = ({
  onChange,
}: {
  onChange: (dirty: boolean) => void;
}) => {
  const { dirty } = useFormikContext();
  React.useEffect(() => onChange(dirty), [dirty, onChange]);
  return null;
};

const EditProfileDialog = ({ onClose }: IProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer.user);

  const [avatar, setAvatar] = React.useState<string>(user.avatarUrl);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const [isDragging, setIsDragging] = React.useState(false);

  const hasNewAvatar = avatar !== user.avatarUrl;

  const discardNewAvatar = React.useCallback(async () => {
    if (hasNewAvatar && avatar) await dispatch(deleteUserAvatar(avatar));
  }, [avatar, dispatch, hasNewAvatar]);

  const requestClose = React.useCallback(() => {
    if (isDirty || hasNewAvatar) {
      setIsConfirmOpen(true);
      return;
    }
    onClose();
  }, [hasNewAvatar, isDirty, onClose]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConfirmOpen) requestClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConfirmOpen, requestClose]);

  const handleChangeFile = async (file?: File) => {
    if (!file || !ACCEPTED_TYPES.includes(file.type)) return;
    const formData = new FormData();
    formData.append('avatar', file);

    const { payload } = await dispatch(addUserAvatar(formData));
    const { url } = payload as { url: string };
    if (!url) return;

    await discardNewAvatar();
    setAvatar(url);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={requestClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-heading"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          <Formik
            initialValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              description: user.description ?? '',
            }}
            validationSchema={UserEditSchema}
            onSubmit={async (values) => {
              const result = await dispatch(
                updateUser({ ...values, avatarUrl: avatar }),
              );
              const { status } = result.payload as { status: number };
              if (status < 200 || status >= 300) return;

              if (hasNewAvatar && user.avatarUrl) {
                await dispatch(deleteUserAvatar(user.avatarUrl));
              }
              onClose();
            }}
          >
            {({ values, dirty, isSubmitting, isValid }) => (
              <Form className="flex min-h-0 flex-col">
                <DirtyReporter onChange={setIsDirty} />
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <h2
                    id="edit-profile-heading"
                    className="text-xl font-semibold text-gray-900"
                  >
                    Edit profile
                  </h2>
                  <button
                    type="button"
                    aria-label="Close"
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    onClick={requestClose}
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto px-6 py-5">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleChangeFile(e.dataTransfer.files[0]);
                    }}
                    className={`mb-4 flex items-center gap-4 rounded-2xl border-2 border-dashed p-3 transition ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-transparent'
                    }`}
                  >
                    <Components.ImageRenderer
                      imageUrl={avatar}
                      type="userAvatar"
                      alt="Your avatar"
                      className="size-20 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start gap-1">
                      <label
                        htmlFor="avatar-file"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Camera className="size-4" />
                        Change photo
                      </label>
                      <span className="text-xs text-gray-500">
                        or drag and drop a JPG or PNG here
                      </span>
                    </div>
                    <input
                      id="avatar-file"
                      type="file"
                      accept={ACCEPTED_TYPES.join(',')}
                      className="sr-only"
                      onChange={(e) => {
                        handleChangeFile(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </div>

                  <div className="grid gap-x-4 sm:grid-cols-2">
                    <FormikFields value="firstName" />
                    <FormikFields value="lastName" />
                  </div>
                  <FormikFields value="email" type="email" />
                  <FormikTextArea
                    value="description"
                    label="bio"
                    placeholder={values.description}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                  <button
                    type="button"
                    className="cursor-pointer rounded-full px-5 py-2.5 font-medium text-gray-600 transition hover:bg-gray-100"
                    onClick={requestClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !isValid || (!dirty && !hasNewAvatar)
                    }
                    className="cursor-pointer rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600 disabled:active:scale-100"
                  >
                    {isSubmitting ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isConfirmOpen && (
          <Components.ModalConfirmation
            header="Discard changes?"
            body="You have unsaved changes. Are you sure you want to leave?"
            confirm="Discard"
            cancel="Keep editing"
            setIsModalOpen={setIsConfirmOpen}
            setIsEditMode={() => {}}
            setModalMessage={async (message) => {
              if (message !== 'ok') return;
              await discardNewAvatar();
              onClose();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default EditProfileDialog;

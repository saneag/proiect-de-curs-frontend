import React from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { FileUploader } from 'react-drag-drop-files';
import { AnimatePresence } from 'framer-motion';

import { Components } from 'components';

import { FormikFields, FormikTextArea } from './FormikFields';
import { UserEditSchema } from './FormikSchemas';

import {
    addUserAvatar,
    deleteUserAvatar,
    updateUser,
} from 'redux/slices/userSlice';

interface IUserFormValues {
    firstName: string;
    lastName: string;
    email: string;
    description: string;
}

type FormHelpers = Pick<
    FormikHelpers<IUserFormValues>,
    'setErrors' | 'resetForm'
>;

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.userReducer.user);
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [rsForm, setRsForm] = React.useState<FormHelpers | null>(null);

    const [avatar, setAvatar] = React.useState<string>(user.avatarUrl);
    const [prevAvatarUrl, setPrevAvatarUrl] = React.useState<string>(
        user.avatarUrl,
    );
    const fileTypes = ['JPG', 'PNG', 'JPEG'];

    if (user.avatarUrl !== prevAvatarUrl) {
        setPrevAvatarUrl(user.avatarUrl);
        setAvatar(user.avatarUrl);
    }

    const handleSubmit = (values: IUserFormValues) => {
        const { firstName, lastName, email, description } = values;

        setIsEditMode(false);
        dispatch(
            updateUser({
                firstName,
                lastName,
                email,
                description,
                avatarUrl: avatar,
            }),
        );
    };

    const handleCancel = (helpers: FormHelpers) => {
        setIsModalOpen(true);
        setRsForm(helpers);
    };

    const handleModalMessage = (message: 'ok' | 'cancel') => {
        if (message === 'ok') {
            setIsEditMode(false);
            setAvatar(user.avatarUrl);
            rsForm?.resetForm();
        }
    };

    const handleChangeFile = async (e: File | File[]) => {
        const file = Array.isArray(e) ? e[0] : e;
        const formData = new FormData();
        if (avatar && file.name !== avatar.split('uploads/')[1]) {
            dispatch(deleteUserAvatar(avatar));
        }
        formData.append('avatar', file);

        const { payload } = await dispatch(addUserAvatar(formData));
        const { url } = payload as { url: string };
        setAvatar(url);
    };

    return (
        <div className="flex justify-center p-3">
            <Formik
                initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    description: user.description,
                }}
                validationSchema={UserEditSchema}
                initialTouched={{
                    firstName: true,
                    lastName: true,
                    email: true,
                    description: true,
                }}
                onSubmit={(values, actions) => {
                    handleSubmit(values);
                    actions.setSubmitting(true);
                }}
            >
                {({ setErrors, resetForm, values }) => (
                    <Form className="flex flex-col gap-3">
                        <div className="flex w-full flex-col flex-wrap content-center items-center gap-3">
                            <div className="relative flex size-32 rounded-full">
                                {avatar !== '' ? (
                                    <Components.ImageRenderer
                                        imageUrl={avatar}
                                        alt={'No avatar'}
                                        className={
                                            'size-full rounded-full object-cover text-9xl'
                                        }
                                    />
                                ) : (
                                    <div className="flex size-full flex-col items-center">
                                        <Components.ImageRenderer
                                            imageUrl={user.avatarUrl}
                                            type={'userAvatar'}
                                            alt={'No avatar'}
                                            className={
                                                'size-full rounded-full object-cover text-9xl'
                                            }
                                        />
                                    </div>
                                )}
                                {!isEditMode && (
                                    <div className="absolute top-0 -right-5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditMode(true);
                                            }}
                                        >
                                            <span className="material-symbols-outlined text-blue-700">
                                                edit
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            {isEditMode && (
                                <FileUploader
                                    handleChange={handleChangeFile}
                                    name="file"
                                    types={fileTypes}
                                    multiple={false}
                                    label="Drag & Drop your avatar here"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                            <div>
                                <FormikFields
                                    value={'firstName'}
                                    disabled={!isEditMode}
                                />
                                <FormikFields
                                    value={'lastName'}
                                    disabled={!isEditMode}
                                />
                                <FormikFields
                                    value={'email'}
                                    type={'email'}
                                    disabled={!isEditMode}
                                />
                            </div>
                            <FormikTextArea
                                value={'description'}
                                disabled={!isEditMode}
                                placeholder={values.description}
                            />
                        </div>

                        {isEditMode && (
                            <div className="mt-4 flex justify-center gap-3">
                                <button
                                    className="rounded-sm bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
                                    type="submit"
                                >
                                    Submit
                                </button>
                                <button
                                    className="rounded-sm bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
                                    type="button"
                                    onClick={() =>
                                        handleCancel({ setErrors, resetForm })
                                    }
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
            <AnimatePresence>
                {isEditMode && isModalOpen && (
                    <Components.ModalConfirmation
                        header="Confirm"
                        body="You have unsaved changes. Are you sure you want to leave?"
                        confirm="Ok"
                        cancel="Cancel"
                        setIsModalOpen={setIsModalOpen}
                        setIsEditMode={setIsEditMode}
                        setModalMessage={handleModalMessage}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfile;

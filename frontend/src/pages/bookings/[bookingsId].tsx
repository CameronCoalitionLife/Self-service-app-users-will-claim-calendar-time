import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/bookings/bookingsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditBookings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    user: '',

    time_slot: '',

    recurrence: '',

    end_date: new Date(),

    occurrences: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { bookings } = useAppSelector((state) => state.bookings);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { bookingsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: bookingsId }));
  }, [bookingsId]);

  useEffect(() => {
    if (typeof bookings === 'object') {
      setInitialValues(bookings);
    }
  }, [bookings]);

  useEffect(() => {
    if (typeof bookings === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = bookings[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [bookings]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: bookingsId, data }));
    await router.push('/bookings/bookings-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit bookings')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit bookings'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='User' labelFor='user'>
                <Field
                  name='user'
                  id='user'
                  component={SelectField}
                  options={initialValues.user}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='TimeSlot' labelFor='time_slot'>
                <Field
                  name='time_slot'
                  id='time_slot'
                  component={SelectField}
                  options={initialValues.time_slot}
                  itemRef={'time_slots'}
                  showField={'start_time'}
                ></Field>
              </FormField>

              <FormField label='Recurrence' labelFor='recurrence'>
                <Field name='Recurrence' id='Recurrence' component='select'>
                  <option value='one-time'>one-time</option>

                  <option value='weekly'>weekly</option>

                  <option value='bi-weekly'>bi-weekly</option>

                  <option value='monthly'>monthly</option>
                </Field>
              </FormField>

              <FormField label='EndDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.end_date
                      ? new Date(
                          dayjs(initialValues.end_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, end_date: date })
                  }
                />
              </FormField>

              <FormField label='NumberofOccurrences'>
                <Field
                  type='number'
                  name='occurrences'
                  placeholder='NumberofOccurrences'
                />
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organizations'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/bookings/bookings-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditBookings.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_BOOKINGS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditBookings;

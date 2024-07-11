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

import { update, fetch } from '../../stores/time_slots/time_slotsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditTime_slots = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    start_time: new Date(),

    end_time: new Date(),

    location: '',

    booked_by: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { time_slots } = useAppSelector((state) => state.time_slots);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { time_slotsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: time_slotsId }));
  }, [time_slotsId]);

  useEffect(() => {
    if (typeof time_slots === 'object') {
      setInitialValues(time_slots);
    }
  }, [time_slots]);

  useEffect(() => {
    if (typeof time_slots === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = time_slots[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [time_slots]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: time_slotsId, data }));
    await router.push('/time_slots/time_slots-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit time_slots')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit time_slots'}
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
              <FormField label='StartTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.start_time
                      ? new Date(
                          dayjs(initialValues.start_time).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, start_time: date })
                  }
                />
              </FormField>

              <FormField label='EndTime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.end_time
                      ? new Date(
                          dayjs(initialValues.end_time).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, end_time: date })
                  }
                />
              </FormField>

              <FormField label='Location' labelFor='location'>
                <Field
                  name='location'
                  id='location'
                  component={SelectField}
                  options={initialValues.location}
                  itemRef={'locations'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField label='BookedBy' labelFor='booked_by'>
                <Field
                  name='booked_by'
                  id='booked_by'
                  component={SelectField}
                  options={initialValues.booked_by}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
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
                  onClick={() => router.push('/time_slots/time_slots-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditTime_slots.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_TIME_SLOTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditTime_slots;

import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
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
import { SwitchField } from '../../components/SwitchField';

import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { RichTextField } from '../../components/RichTextField';

import { create } from '../../stores/time_slots/time_slotsSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  start_time: '',

  end_time: '',

  location: '',

  booked_by: '',

  organization: '',
};

const Time_slotsNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // get from url params
  const { dateRangeStart, dateRangeEnd } = router.query;

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/time_slots/time_slots-list');
  };
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='New Item'
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={
              dateRangeStart && dateRangeEnd
                ? {
                    ...initialValues,
                    start_time:
                      moment(dateRangeStart).format('YYYY-MM-DDTHH:mm'),
                    end_time: moment(dateRangeEnd).format('YYYY-MM-DDTHH:mm'),
                  }
                : initialValues
            }
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='StartTime'>
                <Field
                  type='datetime-local'
                  name='start_time'
                  placeholder='StartTime'
                />
              </FormField>

              <FormField label='EndTime'>
                <Field
                  type='datetime-local'
                  name='end_time'
                  placeholder='EndTime'
                />
              </FormField>

              <FormField label='Location' labelFor='location'>
                <Field
                  name='location'
                  id='location'
                  component={SelectField}
                  options={[]}
                  itemRef={'locations'}
                ></Field>
              </FormField>

              <FormField label='BookedBy' labelFor='booked_by'>
                <Field
                  name='booked_by'
                  id='booked_by'
                  component={SelectField}
                  options={[]}
                  itemRef={'users'}
                ></Field>
              </FormField>

              <FormField label='organization' labelFor='organization'>
                <Field
                  name='organization'
                  id='organization'
                  component={SelectField}
                  options={[]}
                  itemRef={'organizations'}
                ></Field>
              </FormField>

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

Time_slotsNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_TIME_SLOTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Time_slotsNew;

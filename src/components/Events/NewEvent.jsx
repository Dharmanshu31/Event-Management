import { Link, useNavigate } from 'react-router-dom';
import {createNewEvent, queryClient} from '../../utils/http.js'
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import ErrorBlock from './../UI/ErrorBlock';

export default function NewEvent() {
  const navigate = useNavigate();
  const {mutate,isPending,isError,error} = useMutation({
    mutationFn:createNewEvent,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['events']});
      navigate('/events')
    }
  })
  function handleSubmit(formData) {
    mutate({event:formData})
  }
  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submiting......'}
        {!isPending &&
        <>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Create
        </button>
      </>}
      </EventForm>
      {isError && <ErrorBlock title='Error Occures' message={error.info?.message||'Provide Every Data'}/>}
    </Modal>
  );
}

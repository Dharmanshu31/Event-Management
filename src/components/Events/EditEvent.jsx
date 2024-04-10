import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchEvent, queryClient, updateEvent} from '../../utils/http.js';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function EditEvent() {
  const navigate = useNavigate();
  const{id}=useParams();
  const {data}=useQuery({
    queryKey:['events',id],
    queryFn:({signal})=>fetchEvent({signal,id})
  })
  const{mutate}=useMutation({
    mutationFn:updateEvent,
    onMutate:async(data)=>{
      const newData=data.event
      await queryClient.cancelQueries({queryKey:['events',id]})
      const previous=queryClient.getQueryData(['events',id])
      queryClient.setQueryData(['events',id],newData)
      return {previous};
    },
    onError:(context)=>{
      queryClient.setQueryData(['events',id],context.previous)
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['events',id])
    }
  })
  function handleSubmit(formData) {
    mutate({id,event:formData})
    navigate('/events')
  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    </Modal>
  );
}

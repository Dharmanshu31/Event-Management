import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { fetchEvent,deleteEvent, queryClient } from "../../utils/http.js";
import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import ErrorBlock from "./../UI/ErrorBlock";

export default function EventDetails() {
  const {id} = useParams();
  const navigate=useNavigate()
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });
  const {mutate} = useMutation({
    mutationFn:deleteEvent,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["events", id]}),
      navigate('/events')
    }
  })
  const handalDelete=()=>{
    mutate({id})
  }
  let content;
  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching Event......</p>
      </div>
    );
  }
  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="You No What Time It Is"
          message={error.info?.message || "ERROR TIME"}
        />
      </div>
    );
  }
  if (data) {
    content = (
      <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handalDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {data.date} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>
    );
  }
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
    </>
  );
}

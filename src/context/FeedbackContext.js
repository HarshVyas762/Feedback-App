import { createContext, useState, useEffect } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  //Fetch Feedback
  const fetchFeedback = async () => {
    const respones = await fetch(
      "/feedback?_sort=id&_order=desc"
    );
    const data = await respones.json();
    setFeedback(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeedback(); 
  }, []);

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure?")) {
      
      await fetch(`/feedback/${id}`, {method: 'DELETE'})

      setFeedback(feedback.filter((item) => item.id !== id));
    }
  };

  const updateFeedback = async (id, updItem) => {
    
    const response = await fetch(`/feedback/${id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem)
    })

    const data = await response.json()

    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const addFeedback = async (newFeedback) => {
    const response = await fetch('/Feedback',{
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(newFeedback),
    })

    const data = await response.json()

    setFeedback([data, ...feedback]);
  };

  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    });
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        isLoading,
        deleteFeedback,
        editFeedback,
        addFeedback,
        feedbackEdit,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};


export default FeedbackContext
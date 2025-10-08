import './App.css';
import ReviewList from './components/reviews/ReviewList';
// import ChatBot from './components/ui/ChatBot';

function App() {
   return (
      <div className="p-4 h-screen">
         {/* <ChatBot /> */}
         <ReviewList productId={1} />
      </div>
   );
}

export default App;

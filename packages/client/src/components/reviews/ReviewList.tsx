import { useEffect, useState } from 'react';
import axios from 'axios';
import StarRatings from './StarRatings';
import Skeleton from 'react-loading-skeleton';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};
const ReviewList = ({ productId }: Props) => {
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState('');

   const fetchReviews = async () => {
      setIsLoading(true);
      setError('');
      try {
         const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
         );
         setReviewData(data);
      } catch (error) {
         setError('Could not Fetch the reviews. Try again!!!');
      } finally {
         console.error(`Error Occured in fetchReviews: ${error.toString()}`);
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchReviews();
   }, []);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton width={2} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return <p className="text-red-500">{error}</p>;
   }

   return (
      <div className="flex flex-col gap-5">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>
                  Rating: <StarRatings value={review.rating} />
               </div>
               <p className="py-2">{review.content}</p>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;

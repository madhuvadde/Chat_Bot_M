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
   const fetchReviews = async () => {
      setIsLoading(true);
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      setReviewData(data);
      setIsLoading(false);
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

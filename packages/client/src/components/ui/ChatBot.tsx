import type { KeyboardEvent } from 'react';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';

type FormData = {
   prompt: string;
};

const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const onSubmitHandler = (data: FormData) => {
      console.log(data);
      reset();
   };

   const onKeyDownHandler = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault(); //To get rid of extra space when clicked on enter(default behaviour)
         handleSubmit(onSubmitHandler)();
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmitHandler)}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         onKeyDown={onKeyDownHandler}
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (data) => data.trim().length > 0,
            })}
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything"
            maxLength={100}
         />
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatBot;

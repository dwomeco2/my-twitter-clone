import HomeLayout from "components/homeLayout";
import { create } from "mutative";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { RiAccountCircleFill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type FormValues = {
  postContent: string;
};

const TweetComponent = () => {
  const { register, handleSubmit, watch, reset } = useForm<FormValues>();

  const utils = api.useContext();

  const createPost = api.example.createPost.useMutation({
    onSuccess: (data) => {
      const key = { id: data.authorId };
      const old = utils.example.userPostById.getData(key);
      if (old) {
        const newData = create(old, (draft) => {
          draft.posts.unshift(data);
        });
        utils.example.userPostById.setData(key, newData);
      }
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const postContent = data.postContent;
    if (postContent.length > 0) {
      createPost.mutate({ content: postContent });
    }
    reset();
  };

  const postContent = watch("postContent");
  const hasPostContent = postContent?.length > 0 ?? false;

  const buttonColor = hasPostContent ? "bg-[#1d9bf0]" : "bg-[#8ecdf7]";
  return (
    <div className="flex border-t">
      <form
        className="flex grow flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex px-2 pt-2">
          <div className="text-5xl text-yellow-400">
            <RiAccountCircleFill />
          </div>
          {/* TODO: https://www.npmjs.com/package/react-textarea-autosize */}
          <textarea
            className="h-24 grow resize-none overflow-hidden pl-2 outline-none"
            placeholder="What's happening?"
            {...register("postContent", { required: true })}
            required
          />
        </div>
        <div className="flex w-full border-y p-2">
          <button
            type="submit"
            className={`${buttonColor} ml-auto w-20 rounded-full px-4 py-1 text-white transition-all hover:bg-[#1A8CD8]`}
          >
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
};

type PostProps = {
  post: Pick<Post, "id" | "type" | "content" | "createdAt">;
  authorName: string;
};

const Post = (props: PostProps) => {
  const { post, authorName } = props;
  const ago = dayjs(post.createdAt).fromNow();
  return (
    <div className="flex">
      <div className="text-5xl text-yellow-400">
        <RiAccountCircleFill />
      </div>
      <div className="flex grow flex-col pl-2 text-sm ">
        <div className="flex">
          <div className="font-medium">{authorName}</div>
          <div>&nbsp; · {ago}</div>
        </div>
        <div className="">{post.content}</div>
        <div className="h-8"></div>
      </div>
    </div>
  );
};

const Home = () => {
  const { data: session } = useSession();

  const user = session?.user;
  const userId = user?.id ?? "";

  const posts = api.example.userPostById.useQuery(
    {
      id: userId,
    },
    { enabled: !!userId }
  );

  return (
    <HomeLayout>
      <section className="flex flex-col border-x">
        <TweetComponent />
        <div className="px-2 pt-2 text-2xl">
          {posts.data?.posts.map((post) => {
            const authorName = posts.data?.name as string;
            return (
              <Post
                key={`post-${post.id}`}
                post={post}
                authorName={authorName}
              />
            );
          })}
        </div>
      </section>
    </HomeLayout>
  );
};

Home.auth = true;

export default Home;

import { PostsList } from "@/components/shared/post/postList";
import { Loader } from "@/components/ui/Loader";
import { Section } from "@/components/ui/Section";
import { CategoryService } from "@/services/category.service";
import { PostService } from "@/services/post.service";
import { onRequest } from "@/types";
import { RoutesConfig } from "@/types/pagesConfig";
import { findCategoryByPath } from "@/utils";
import { handleError } from "@/utils/handleError";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const PostsPage = () => {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { category } = useParams<{ category: string }>();
    const route = findCategoryByPath(category)


    const getPosts = async () => {
        setIsLoading(true)

        const data = await onRequest(PostService.getPosts(category!))
        console.log(data)
        if (data) {
            setIsLoading(false)
            setPosts(data)
        }
    }

    useEffect(() => {
        getPosts()

        if (!route) {
            toast.error("Invalid category path");
            navigate(RoutesConfig.HOME.path);
        }



    }, [route, navigate]);







    return (
        <>
            <h1 className="text-3xl text-center font-bold m-5">{route?.label}</h1>
            {isLoading && <Loader />}

            {!isLoading && <PostsList posts={posts} />}
        </>

    )
}
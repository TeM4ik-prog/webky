import { useEffect, useState } from "react";
import { onRequest } from "@/types";
import { PageContainer } from "@/components/layout/PageContainer";
import { ReviewList } from "@/components/shared/review/reviewList";
import { CommentService } from "@/services/comment.service";
import { IReview } from "@/components/shared/review/review";
import { returnObjectFromForm } from "@/utils";
import { ReviewService } from "@/services/review.service";
import { toast } from "react-toastify";
import { useUserData } from "@/store/hooks";


const interviews = [
    {
        id: 1,
        name: "Иван Иванов",
        position: "Ученик 10 класса",
        image: "/ivan.jpg",
        text: "Я учусь в гимназии уже 5 лет. Здесь я нашёл друзей и получил много знаний, которые помогут мне в будущем. Также я участвую в различных мероприятиях и олимпиадах, что даёт мне огромный опыт и мотивацию для дальнейшего развития.",
    },
    {
        id: 2,
        name: "Мария Петрова",
        position: "Ученица 11 класса",
        image: "/maria.jpg",
        text: "Гимназия дала мне не только знания, но и уверенность в себе. Я участвовала в олимпиадах и научных конференциях. Благодаря этому у меня появилось больше возможностей и шансов поступить в хороший университет.",
    },
    {
        id: 3,
        name: "Алексей Сидоров",
        position: "Выпускник",
        image: "/alexey.jpg",
        text: "Благодаря гимназии я поступил в престижный университет. Здесь я научился ставить цели и достигать их. Также я освоил множество полезных навыков, которые помогают мне в учёбе и жизни.",
    },
];



export const LoveGymnPage: React.FC = () => {
    const [comments, setComments] = useState<IReview[]>([])

    const { user } = useUserData()

    const getAllComments = async () => {
        console.log(user?.id)
        const data: IReview[] = await onRequest(CommentService.getComments())
        console.log(data)
        if (data) {
            setComments(data)
        }
    }

    const handleCommentUpdate = async (id: string, e: React.FormEvent) => {
        e.preventDefault()

        const formObject = returnObjectFromForm(e)

        const data = await onRequest(CommentService.updateComment(id, formObject))

        console.log("Ответ от сервера:", data);

        toast.success(`Post updated successfully`)
        window.location.reload()

        console.log(data);
    };

    const handleCommentDelete = async (id: string) => {
        console.log(id)
        await onRequest(CommentService.deleteComment(id))
        window.location.reload();
    }

    useEffect(() => {
        getAllComments()
    }, [])

    return (
        <>
            <PageContainer title="Люблю свою гимназию">
                <ReviewList  reviews={comments} handleUpdate={handleCommentUpdate} handleDelete={handleCommentDelete} />
            </PageContainer>
        </>
    );
};

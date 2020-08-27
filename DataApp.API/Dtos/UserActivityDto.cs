namespace DataApp.API.Dtos
{
    public class UserActivityDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public bool IsTyping { get; set; }
    }
}
namespace MiniGames.Models
{
    using UsernameGenerator;

    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string GroupId { get; set; }

        public User()
        {
            this.Name = UsernameGenerator.GenerateUsername();
        }

        public object DTO()
        {
            return new
            {
                this.Id,
                this.Name
            };
        }
    }
}
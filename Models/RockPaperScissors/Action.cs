namespace MiniGames.RockPaperScissors.Models
{
    public struct Action
    {
        public string UserId { get; set; }
        public string ActionName { get; set; }

        public Action(string userId, string actionName)
        {
            UserId = userId;
            ActionName = actionName;
        }

        public Action CensorAction()
        {
            return new Action(this.UserId, null);
        }
    }
}
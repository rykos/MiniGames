using Microsoft.AspNetCore.SignalR;

namespace MiniGames.Providers
{
    public class IdBasedProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            string uid = connection.GetHttpContext().Request.Query["uid"];
            if (uid == default)
                uid = System.Guid.NewGuid().ToString();
            return uid;
        }
    }
}
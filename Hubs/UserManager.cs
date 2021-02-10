using System.Collections.Generic;
using System.Linq;

namespace MiniGames.Models
{
    public static class UserManager
    {
        public static HashSet<User> Users = new HashSet<User>();


        public static void UserInit(string userId)
        {
            lock (Users)
            {
                User user = UserManager.Users.FirstOrDefault(u => u.Id == userId);
                if (user == default)
                    UserManager.Users.Add(user = new User() { Id = userId });
            }
        }

        public static void UserSetGroup(string userId, string groupId)
        {
            lock (Users)
            {
                User user = UserManager.Users.FirstOrDefault(u => u.Id == userId);
                if (user == default)
                    UserManager.Users.Add(user = new User() { Id = userId });
                user.GroupId = groupId;
            }
        }

        public static void RemoveUserGroup(string userId)
        {
            lock (Users)
            {
                UserManager.Users.FirstOrDefault(u => u.Id == userId).GroupId = null;
            }
        }

        public static User GetUser(string userId)
        {
            return UserManager.Users.FirstOrDefault(u => u.Id == userId);
        }
    }
}
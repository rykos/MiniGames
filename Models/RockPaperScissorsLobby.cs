using System.Collections.Generic;
using System.Linq;
using MiniGames.Hubs;

namespace MiniGames.Models
{
    public class RockPaperScissorsLobby : Lobby
    {
        public RockPaperScissorsLobby(string id, string name, string game, int players, int playersMax, LobbyHub.LobbyChange lobbyChange) : base(id, name, game, players, playersMax, lobbyChange)
        {
            this.Game = "R&P&S";
        }

        public override void RemoveUser(string userid)
        {
            base.RemoveUser(userid);
            this.RemoveAction(userid);
        }

        public void Use(string userId, string actionName)
        {
            //Action already performed
            if (this.UserActions.FirstOrDefault(a => a.UserId == userId).UserId != default)
                return;

            UserActions.Add(new Action(userId, actionName));
        }

        public bool GameIsFinished()
        {
            //All users acted
            if (UserActions.Count() >= this.users.Count())
            {
                return true;
            }
            return false;
        }

        public Action[] GetActions()
        {
            Action[] actions;
            lock (this.UserActions)
            {
                actions = this.UserActions.ToArray();
                this.UserActions.Clear();
            }
            return actions;
        }

        public List<Action> UserActions = new List<Action>();

        private void RemoveAction(string userId)
        {
            var action = this.UserActions.FirstOrDefault(a => a.UserId == userId);
            if (action.UserId != default)
            {
                this.UserActions.Remove(action);
            }
        }

        public struct Action
        {
            public string UserId { get; set; }
            public string ActionName { get; set; }

            public Action(string userId, string actionName)
            {
                UserId = userId;
                ActionName = actionName;
            }
        }
    }
}
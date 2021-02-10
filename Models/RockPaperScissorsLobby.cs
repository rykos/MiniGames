using System;
using System.Collections.Generic;
using System.Linq;
using MiniGames.Hubs;
using MiniGames.Models;
using static MiniGames.Hubs.LobbyHub;

namespace MiniGames.RockPaperScissors.Models
{
    public class RockPaperScissorsLobby : Lobby
    {
        public List<Action> UserActions = new List<Action>();
        public RockPaperScissorsLobby(string id, string name, string game, int players, int playersMax, string creatorId, LobbyChange lobbyChange) : base(id, name, game, players, playersMax, creatorId, lobbyChange)
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

        public GameState GetState()
        {
            return new GameState()
            {
                Actions = this.UserActions,
                Users = this.users,
                FinishTime = DateTime.UtcNow,
                ActiveUsers = this.users.Select(u => u.Id).ToList()
            };
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


        private void RemoveAction(string userId)
        {
            var action = this.UserActions.FirstOrDefault(a => a.UserId == userId);
            if (action.UserId != default)
            {
                this.UserActions.Remove(action);
            }
        }
    }
}
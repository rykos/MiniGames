using System;
using System.Collections.Generic;
using MiniGames.Models;

namespace MiniGames.RockPaperScissors.Models
{
    public class GameState
    {
        // Is the game in progress
        public bool Started { get; set; }
        // Time at which game will forcefully finish
        public DateTime FinishTime { get; set; }
        // All users in a room
        public List<User> Users { get; set; }
        // User id's that are granted right to make action
        public List<string> ActiveUsers { get; set; }
        public List<Models.Action> Actions { get; set; }
    }
}
using BankManagement.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class AccountDetails
    {

        public string AccountType { get; set; }
        public double Balance { get; set; }
        public string Currency { get; set; }
        public string AccountNumber { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
        public List<TransactionHistory> Transaction { get; set; }
    }
}

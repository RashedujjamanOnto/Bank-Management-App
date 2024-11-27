using BankManagement.Data;
using BankManagement.Model;
using Microsoft.AspNetCore.Mvc;

namespace BankManagement.Controllers
{
    public class InterestScheduler : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        public InterestScheduler(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Timer timer = new Timer(CreditInterest, null, TimeSpan.Zero, TimeSpan.FromDays(30));
            return Task.CompletedTask;
        }

        private void CreditInterest(object state)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<BankDbContext>();
                var accounts = context.Accounts.Where(a => a.AccountType == "Savings").ToList();

                foreach (var account in accounts)
                {
                    var interest = (account.Balance * account.InterestRate / 100);
                    account.Balance += interest;

                    // Log transaction
                    context.Transactions.Add(new Transaction
                    {
                        AccountId = account.AccountId,
                        Amount = interest,
                        TransactionType = Enums.TransactionType.Interest,
                        TransactionDate = DateTime.Now
                    });
                }

                context.SaveChanges();
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }

}


import csv
from time import time
import yfinance as yf
from enum import Enum
yf.__version__ = '0.1.54'

class DataStatus(Enum):
    Loading = 'loading'
    Done = 'done'
    Refreshing = 'refreshing'

class Bot:
    # init method or constructor
    def __init__(self):
        self.csv_path = "companies.csv"
        self.companyList = []
        self.companySymbolList = []
        self.data = {}
        self.dataStatus = DataStatus.Loading

        with open(self.csv_path, 'r') as file:
            csvreader = csv.reader(file)
            for row in csvreader:
                self.companyList.append(row)
                self.companySymbolList.append(row[0])

        self.get_data()

    def get_data (self):
        loaded = 0
        self.dataStatus = DataStatus.Refreshing
        
        for s in self.companySymbolList:
            time.sleep(1)
            d = yf.Ticker(s)
            if d != None:
                self.data[s] = d.info
                loaded += 1
                print(str.format("Loaded {} of {}", loaded, len(self.companySymbolList)))
        self.dataStatus = DataStatus.Done
    
    def isLoaded(self):
        return self.dataStatus == DataStatus.Done or self.dataStatus == DataStatus.Refreshing
        
    

            

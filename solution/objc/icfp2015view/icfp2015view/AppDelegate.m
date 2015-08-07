//
//  AppDelegate.m
//  icfp2015view
//
//  Created by Paul Taykalo on 8/1/15.
//  Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "AppDelegate.h"
#import "Board.h"
#import "BoardCreator.h"
#import "BoardsConfigCollection.h"


@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    NSString * json = [BoardsConfigCollection problem0];
    Board * board = [BoardCreator createBoardFromJson:json];
    
    NSLog(@"board %@", board);
    return YES;
}

@end

//
// Created by Anastasi Voitova on 08.08.15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "CommandToLettersConvertor.h"


@implementation CommandToLettersConvertor {

}

+ (NSString * )generateLettersFrom:(NSString * )commands {
    if (!commands) {
        return nil;
    }
    
    NSArray * array = [commands componentsSeparatedByCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];

    NSMutableString * megaString = [NSMutableString new];
    [array enumerateObjectsUsingBlock:^(NSString * command, NSUInteger idx, BOOL * stop) {
         NSString * letter = [[self class] substitutionStringForCommand:command];
        if (letter) {
           [megaString appendString:letter];
        }        
    }];

    // TODO: powerwords

    return megaString;
}


+ (NSString * )substitutionStringForCommand:(NSString * )command {
    NSArray * letters = nil;
    if ([command isEqualToString:@"W"]) {
        letters = @[@"p",@"'",@"!", @".", @"0", @"3"];

    } else if ([command isEqualToString:@"E"]) {
        letters = @[@"b",@"c",@"e", @"f", @"y", @"2"];

    } else if ([command isEqualToString:@"SW"]) {
        letters = @[@"a",@"g",@"h", @"i", @"j", @"4"];

    } else if ([command isEqualToString:@"SE"]) {
        letters = @[@"l",@"m",@"n", @"o", @" ", @"5"];

    } else if ([command isEqualToString:@"C"]) {
        letters = @[@"d",@"q",@"r", @"v", @"z", @"1"];

    } else if ([command isEqualToString:@"CC"]) {
        letters = @[@"k",@"s",@"t", @"u", @"w", @"x"];
    }

    return [letters firstObject];
    return letters[arc4random_uniform([letters count])];
}

@end